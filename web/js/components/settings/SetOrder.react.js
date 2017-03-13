import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Utils from '../../utils/Utils';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

const OrderableSource = {

    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        };
    }
};

const OrderableTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        props.moveItem(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    }
};

class OrderableItem extends React.Component {

    render() {
        const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(connectDropTarget(
            <div style={{ ...style, opacity }}>
                {text}
            </div>,
        ));
    }
}

OrderableItem = DropTarget('orderable', OrderableTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(OrderableItem);
OrderableItem = DragSource('orderable', OrderableSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(OrderableItem);

class SetOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: Utils.sortItems(props.items),
            store: props.store
        };

        this.moveItem = this.moveItem.bind(this);
        this._onSave = this._onSave.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let items = Utils.sortItems(nextProps.items);

        this.setState({
            items: items,
            store: nextProps.store
        })
    }

    moveItem(dragIndex, hoverIndex) {
        let items = this.state.items.slice();
        let dragItem = items[dragIndex];

        items.splice(dragIndex, 1);
        items.splice(hoverIndex, 0, dragItem);

        this.setState({
            items: items
        });
    }

    _onSave(e) {
        this.state.items.map((item, pos) => {
            this.state.store.updateById(item.id, {position: pos});
        });
    }

    render() {
        return (
            <div>
                <h2>Drag and drop items to set their order</h2>
                {
                    this.state.items.map((item, i) => {
                        return (
                            <OrderableItem
                                key={item.id}
                                index={i}
                                id={item.id}
                                text={item.label || item.name}
                                moveItem={this.moveItem}
                            />
                        )
                    })
                }
                <br/>
                <br/>
                <button type="button" className={"btn btn-success"} aria-label="Save" onClick={this._onSave.bind(this)}>Save</button>
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(SetOrder);
