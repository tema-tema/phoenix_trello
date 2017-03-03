import React, {PropTypes}   from 'react';
import { connect }          from 'react-redux';

import Actions              from '../../actions/current_board';
import Constants            from '../../constants';
import { setDocumentTitle } from '../../utils';
import BoardMembers          from '../../components/boards/users';


class BoardsShowView extends React.Component {
    componentDidMount() {
        const { socket } = this.props;

        if (!socket) {
            return false;
        }

        this.props.dispatch(Actions.connectToChannel(socket, this.props.params.id));
    }

    componentWillUnmount() {
        this.props.dispatch(Actions.leaveChannel(this.props.currentBoard.channel));
    }

    _renderMembers() {
        const { connectedUsers, showUsersForm, channel, error } = this.props.currentBoard;
        const { dispatch } = this.props;
        const members = this.props.currentBoard.members;
        const currentUserIsOwner = this.props.currentBoard.user.id === this.props.currentUser.id;

        return (
            <BoardMembers
                dispatch={dispatch}
                channel={channel}
                currentUserIsOwner={currentUserIsOwner}
                members={members}
                connectedUsers={connectedUsers}
                error={error}
                show={showUsersForm} />
        );
    }

    _renderLists() {
        const { lists, channel, id, addingNewCardInListId } = this.props.currentBoard;

        return lists.map((list) => {
            return (
                <ListCard
                    key={list.id}
                    boardId={id}
                    dispatch={this.props.dispatch}
                    channel={channel}
                    isAddingNewCard={addingNewCardInListId === list.id}
                    {...list} />
            );
        });
    }

    _renderAddNewList() {
        const { dispatch, formErrors, currentBoard } = this.props;

        if (!currentBoard.showForm) return this._renderAddButton();

        return (
            <ListForm
                dispatch={dispatch}
                errors={formErrors}
                channel={currentBoard.channel}
                onCancelClick={::this._handleCancelClick} />
        );
    }

    _renderAddButton() {
        return (
            <div className="list add-new" onClick={::this._handleAddNewClick}>
                <div className="inner">
                    Add new list...
                </div>
            </div>
        );
    }

    _handleAddNewClick() {
        const { dispatch } = this.props;

        dispatch(Actions.showForm(true));
    }

    _handleCancelClick() {
        this.props.dispatch(Actions.showForm(false));
    }


    render() {
        const { fetching, name } = this.props.currentBoard;

        if (fetching) return (
            <div className="view-container boards show">
                <i className="fa fa-spinner fa-spin"/>
            </div>
        );

        return (
            <div className="view-container boards show">
                <header className="view-header">
                    <h3>{name}</h3>
                    {::this._renderMembers()}
                </header>
                <div className="canvas-wrapper">
                    <div className="canvas">
                        <div className="lists-wrapper">
                            {::this._renderLists()}
                            {::this._renderAddNewList()}
                        </div>
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }



    const mapStateToProps = (state) => ({
        currentBoard: state.currentBoard,
        socket: state.session.socket,
        currentUser: state.session.currentUser,
});

    export default connect(mapStateToProps)(BoardsShowView);