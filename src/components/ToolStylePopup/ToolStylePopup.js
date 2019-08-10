import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';

import StylePopup from 'components/StylePopup';

import getClassName from 'helpers/getClassName';
import setToolStyles from 'helpers/setToolStyles';
import { mapToolNameToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';

import './ToolStylePopup.scss';

class ToolStylePopup extends React.PureComponent {
  static propTypes = {
    activeToolName: PropTypes.string,
    activeToolStyle: PropTypes.object,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    toolButtonObjects: PropTypes.object.isRequired,
    colorMapKey: PropTypes.string,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.popup = React.createRef();
    this.state = {
      left: 0,
      top: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.close);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && !this.props.isDisabled) {
      this.props.closeElements([
        'viewControlsOverlay',
        'searchOverlay',
        'menuOverlay',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
      ]);
      this.positionToolStylePopup();
    }

    const selectedAnotherTool =
      prevProps.activeToolName !== this.props.activeToolName;
    if (selectedAnotherTool && !this.props.isDisabled) {
      this.positionToolStylePopup();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.close);
  }

  handleClickOutside = e => {
    const toolsOverlay = document.querySelector(
      '[data-element="toolsOverlay"]',
    );
    const header = document.querySelector('[data-element="header"]');
    const clickedToolsOverlay = toolsOverlay?.contains(e.target);
    const clickedHeader = header?.contains(e.target);

    if (!clickedToolsOverlay && !clickedHeader) {
      this.close();
    }
  }

  close = () => {
    this.props.closeElement('toolStylePopup');
  }

  handleStyleChange = (property, value) => {
    setToolStyles(this.props.activeToolName, property, value);
  };

  positionToolStylePopup = () => {
    const { toolButtonObjects, activeToolName } = this.props;
    const dataElement = toolButtonObjects[activeToolName].dataElement;
    const toolButton = document.querySelectorAll(
      `.Header [data-element=${dataElement}], .ToolsOverlay [data-element=${dataElement}]`,
    )[0];

    if (!toolButton) {
      return;
    }

    const { left, top } = this.getToolStylePopupPositionBasedOn(
      toolButton,
      this.popup,
    );

    this.setState({ left, top });
  };

  getToolStylePopupPositionBasedOn = (toolButton, popup) => {
    const buttonRect = toolButton.getBoundingClientRect();
    const popupRect = popup.current.getBoundingClientRect();
    const buttonCenter = (buttonRect.left + buttonRect.right) / 2;
    const popupTop = buttonRect.bottom + 1;
    let popupLeft = buttonCenter - popupRect.width / 2;
    const popupRight = buttonCenter + popupRect.width / 2;

    popupLeft =
      popupRight > window.innerWidth
        ? window.innerWidth - popupRect.width - 12
        : popupLeft;
    popupLeft = popupLeft < 0 ? 0 : popupLeft;

    return { left: popupLeft, top: popupTop };
  };

  render() {
    const { left, top } = this.state;
    const { isDisabled, activeToolName, activeToolStyle } = this.props;
    const isFreeText = activeToolName === 'AnnotationCreateFreeText';
    const className = getClassName(`Popup ToolStylePopup`, this.props);
    const colorMapKey = mapToolNameToKey(activeToolName);

    if (isDisabled) {
      return null;
    }
    const hideSlider = activeToolName === 'AnnotationCreateRedaction';

    return (
      <div
        className={className}
        data-element="toolStylePopup"
        style={{ top, left }}
        ref={this.popup}
      >
        <StylePopup
          key={activeToolName}
          colorMapKey={colorMapKey}
          style={activeToolStyle}
          isFreeText={isFreeText}
          hideSlider={hideSlider}
          onStyleChange={this.handleStyleChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeToolName: selectors.getActiveToolName(state),
  activeToolStyle: selectors.getActiveToolStyles(state),
  isDisabled: selectors.isElementDisabled(state, 'toolStylePopup'),
  isOpen: selectors.isElementOpen(state, 'toolStylePopup'),
  toolButtonObjects: selectors.getToolButtonObjects(state),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  closeElements: actions.closeElements,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(onClickOutside(ToolStylePopup));
