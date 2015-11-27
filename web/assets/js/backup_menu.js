import React from 'react'

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {checked: Math.random() >= 0.5 ? true : false}
  }

  handleChange(event) {
    this.setState({checked: event.target.checked});
    console.log(event.target.checked)
  }

  render() {
    var id = 'onoffswitch-' + this.props.id;
    var checked = this.state.checked;
    return (
      <li>
        <a href="#">
          {this.props.title}
          <div className="onoffswitch pull-right">
            <input type="checkbox" name="onoffswitch"
                className="onoffswitch-checkbox" id={id} checked={checked}
                onChange={this.handleChange.bind(this)} />
            <label className="onoffswitch-label" htmlFor={id}></label>
          </div>
        </a>
      </li>
    );
  }
}

class TaskItem extends React.Component {
  render() {
    var progress = Math.round(Math.random() * 100);
    var progressStyle = {
      width: progress + '%'
    }
    return (
      <div className="list-group-item">
        <div className="list-group-item-heading">
          <span className="title">{this.props.title}</span>
          <span className="time pull-right">9m ago</span>
        </div>
        <p className="list-group-item-text">
          It is a long established fact that a reader will be distracted. <br/>
          Progress: {progress}%
          <div className="progress">
            <div className="progress-bar progress-bar-value" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={progressStyle}>
              <span className="sr-only">40% Complete (success)</span>
            </div>
          </div>
        </p>
      </div>
    );
  }
}

React.render(
  <ul className="nav nav-submenu">
    <MenuItem title="Applogic" id="applogic" />
    <MenuItem title="Web Server" id="webserver" />
    <MenuItem title="GUI" id="gui" />
    <MenuItem title="MY Account" id="mya" />
    <li>
      <a href="#">
        <i className="fa fa-plus"></i> Add new
      </a>
    </li>
  </ul>,
  document.getElementById('collapseProjects')
);

React.render(
  <ul className="nav nav-submenu">
    <MenuItem title="DEV" id="dev" />
    <MenuItem title="TEST" id="test" />
    <MenuItem title="ACC" id="acc" />
    <MenuItem title="PROD" id="prod" />
    <li>
      <a href="#">
        <i className="fa fa-plus"></i> Add new
      </a>
    </li>
  </ul>,
  document.getElementById('collapseEnvironments')
);

React.render(
  <div className="list-group">
    <TaskItem title="Applogic" />
    <TaskItem title="GUI" />
    <TaskItem title="Web Server" />
  </div>,
  document.getElementById('slidemenu')
);

$('.btn-tasks').click(_ => {
  $('.slidemenu').toggleClass('slidemenu-open');
});
