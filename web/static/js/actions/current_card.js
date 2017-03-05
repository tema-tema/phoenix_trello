import Constants  from '../constants';
import {httpGet} from '../utils';

const Actions = {
    showCard: (card) => {
        return dispatch => {
            dispatch({
                type: Constants.CURRENT_CARD_SET,
                card: card
            });
        };
    },

    editCard: (edit) => {
        return dispatch => {
            dispatch({
                type: Constants.CURRENT_CARD_EDIT,
                edit: edit,
            });
        };
    },

    createCardComment: (channel, comment) => {
        return dispatch => {
            channel.push('card:add_comment', comment);
        };
    },

    reset: (channel, comment) => {
        return dispatch => {
            dispatch({
                type: Constants.CURRENT_CARD_RESET,
            });
        };
    },

};

export default Actions;