import React from 'react';
import PropTypes from 'prop-types';
import './MessageBox.css';
import moment from 'moment';
import { Avatar } from '@mui/material';

const MessageBox = ({ userImage, userName, messageTime, userMessage, isSender }) => {
    return (
        <div className={`message ${isSender ? 'message--sender' : 'message--receiver'}`}>
            <div className='message__user-profile'>
                <Avatar />
            </div>
            <div className='message__user-details'>
                <div className='message__user-details__row'>
                    <span>{userName}</span>
                    <span className='message__user-details__time'>{moment(messageTime).format('LLL')}</span>
                </div>
                <div className='message__body message__user-details__row'>
                    {userMessage}
                </div>
            </div>
        </div>
    );
};

MessageBox.propTypes = {
    userImage: PropTypes.string,
    userName: PropTypes.string,
    userMessage: PropTypes.string,
    messageTime: PropTypes.string,
    isSender: PropTypes.bool,
};

MessageBox.defaultProps = {
    userImage: '',
    userName: '',
    messageTime: '',
    userMessage: '',
    isSender: false,
};

export default MessageBox;
