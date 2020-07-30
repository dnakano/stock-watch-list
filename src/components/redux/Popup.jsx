// Component for popup message
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPopup } from './actions';

class Popup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animationListener = this.animationListener.bind(this);
  }

  componentDidMount() {
    // Get the element and initialize animation events
    this.el = document.querySelector('.Popup');
    this.initAnimationEvents();
  }

  componentWillUnmount() {
    // Remove animation events
    this.endAnimationEvents();
  }

  initAnimationEvents() {
    // Add animation events
    if (this.el) {
      this.el.addEventListener(
        'animationstart',
        this.animationListener,
        false
      );

      this.el.addEventListener(
        'animationend',
        this.animationListener,
        false
      );

      this.el.addEventListener(
        'animationiteration',
        this.animationListener,
        false
      );
    }
  }

  endAnimationEvents() {
    // Remove animation events
    if (this.el) {
      this.el.removeEventListener(
        'animationstart',
        this.animationListener,
        false
      );

      this.el.removeEventListener(
        'animationend',
        this.animationListener,
        false
      );

      this.el.removeEventListener(
        'animationiteration',
        this.animationListener,
        false
      );
    }
  }

  animationListener({ type }) {
    // Set up animation event listener

    // Check animation event.type
    switch (type) {
      case 'animationstart':
        break;
      case 'animationend':
        // Reset 'showPopup' state when animation ends
        this.props.setPopup(false);
        break;
      case 'animationiteration':
        break;
      default:
    }
  }

  render() {
    const classes = `Popup ${this.props.showPopup ? 'Popup-show' : 'Popup-hide'}`;

    return (
      <p className={classes}>
        {this.props.children}
      </p>
    );
  }
}

Popup.propTypes = {
  showPopup: PropTypes.bool.isRequired,
  setPopup: PropTypes.func.isRequired,
  children: PropTypes.node,
};

Popup.defaultProps = {
  children: null,
};

const mapState = (state) => ({
  showPopup: state.showPopup,
});

// Action creators to dispatch. Calls bindActionCreators internally
const mapDispatch = {
  setPopup,
};

export default connect(
  mapState,
  mapDispatch
)(Popup);
