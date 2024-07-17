import React, { useState } from 'react';
import PropTypes from 'prop-types';
import defaultUserImage from './../../assets/images/userImage.jpg';
import './MessageBox.css';
const MessageBox = ({ userImage, userName, messageTime, userMessage }) => {
    const userImageSize = '40px';
    return (
        <>
            <div className='message'>
                <div className='message__user-profile'>
                    <img
                        src={userImage}
                        width={userImageSize}
                        height={userImageSize}
                        alt={''}
                        className='message__user-profile--image'
                    />
                </div>
                <div className='message__user-details'>
                    <div className='message__user-details__row'>
                        <span>{userName}</span>
                        <span className='message__user-details__time'>{messageTime}</span>
                    </div>
                    <div className='message__body message__user-details__row'>
                        {userMessage}
                    </div>
                </div>
            </div>
        </>
    );
};
MessageBox.propTypes = {
    userImage: PropTypes.string,
    userName: PropTypes.string,
    userMessage: PropTypes.string,
    messageTime: PropTypes.string,
};
MessageBox.defaultProps = {
    userImage: defaultUserImage,
    userName: '',
    messageTime: '',
    userMessage: '',
};

export default MessageBox;