/**
 * Created by mdanilescu on 20/01/16.
 */
import { History } from 'react-router';


let history = null;

class AppHistory extends History {

    constructor() {
        if (!history) {
            super();
            history = this;
        } else {
            return history;
        }

    }
}

export default new AppHistory();
