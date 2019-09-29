import React from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

interface IHelpProps {
    className?: string;
    tooltipText?: string;
}

class Help extends React.Component<IHelpProps, {}> {
    shouldComponentUpdate() {
        return false;
    }

    HelpIcon({ className, tooltipText }) {
        const [show, setShow] = React.useState(false);
        const target = React.useRef(null);
      
        return (
            <>
                <svg
                    ref={target}
                    onClick={() => setShow(true)}
                    className={className}
                    viewBox='0 0 64 64'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <g transform='translate(178 278)'>
                        <path fill='#134563' d='M-145.9-222c-13.2 0-23.9-10.7-23.9-23.9s10.7-23.9 23.9-23.9 23.9 10.7 23.9 23.9-10.7 23.9-23.9 23.9zm0-45.2c-11.7 0-21.3 9.6-21.3 21.3 0 11.7 9.6 21.3 21.3 21.3 11.7 0 21.3-9.6 21.3-21.3 0-11.8-9.6-21.3-21.3-21.3z'/><path fill='#134563' d='M-153.3-253.5c.4-1.1.9-2 1.6-2.7.7-.7 1.6-1.3 2.6-1.7 1-.4 2.2-.6 3.5-.6 1 0 2 .2 2.9.5.9.3 1.7.8 2.4 1.3s1.2 1.3 1.6 2.1c.4.8.6 1.8.6 2.9 0 1.4-.3 2.5-.9 3.5s-1.4 1.9-2.3 2.8l-1.8 1.8c-.5.4-.8.9-1 1.3s-.4.9-.4 1.5c-.1.6-.1 1-.1 2.1h-2.3c0-1.1 0-1.6.2-2.3.1-.8.4-1.4.7-2.1.3-.6.8-1.2 1.3-1.8.6-.6 1.2-1.2 2-1.9.7-.6 1.3-1.3 1.7-2.1.5-.8.7-1.7.7-2.6 0-.7-.1-1.4-.4-2-.3-.6-.7-1.1-1.1-1.6s-1-.8-1.7-1c-.6-.2-1.3-.4-2-.4-1 0-1.9.2-2.6.5-.8.3-1.4.8-1.9 1.4-.5.6-.9 1.3-1.1 2.1-.2.8-.4 1.5-.3 2.4h-2.3c-.1-1.4 0-2.3.4-3.4zm6 17.5h2.8v2.8h-2.8v-2.8z'/>
                    </g>
                </svg>
                {tooltipText && 
                    <Overlay
                        target={target.current}
                        show={show} 
                        placement='bottom' 
                        onHide={() => {setShow(false)}} 
                        rootClose={true}
                    >
                        <Tooltip id='help-icon-tooltip'>
                            {tooltipText}
                        </Tooltip>
                    </Overlay>
                }
            </>
        )
    }

    render() {
        const HelpIconComponent = this.HelpIcon;

        return (
            <HelpIconComponent className={this.props.className} tooltipText={this.props.tooltipText}/>
        );
    };
}

interface ISettingsProps {
    onClick: () => void
};

class Settings extends React.Component<ISettingsProps, {}> {
    render() {
        return (
            <svg
                onClick={this.props.onClick}
                className='search__settings'
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M17.4 11c0-.3.1-.6.1-1s0-.7-.1-1l2.1-1.7c.2-.2.2-.4.1-.6l-2-3.5c-.1-.1-.3-.2-.6-.1l-2.5 1c-.5-.4-1.1-.7-1.7-1L12.4.5c.1-.3-.2-.5-.4-.5H8c-.2 0-.5.2-.5.4l-.4 2.7c-.6.2-1.1.6-1.7 1L3 3.1c-.3-.1-.5 0-.7.2l-2 3.5c-.1.1 0 .4.2.6L2.6 9c0 .3-.1.6-.1 1s0 .7.1 1L.5 12.7c-.2.2-.2.4-.1.6l2 3.5c.1.1.3.2.6.1l2.5-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .2.2.4.5.4h4c.2 0 .5-.2.5-.4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1c.2.1.5 0 .6-.2l2-3.5c.1-.2.1-.5-.1-.6L17.4 11zM10 13.5c-1.9 0-3.5-1.6-3.5-3.5S8.1 6.5 10 6.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" fill="#fff" fillRule="evenodd"/>
            </svg>
        );
    }
}

export {
    Help,
    Settings
};
