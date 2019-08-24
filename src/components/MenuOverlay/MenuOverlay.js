import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import ActionButton from 'components/ActionButton';
import ToolButton from 'components/ToolButton';

import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import print from 'helpers/print';
import openFilePicker from 'helpers/openFilePicker';
import toggleFullscreen from 'helpers/toggleFullscreen';
import downloadPdf from 'helpers/downloadPdf';
import { isIOS } from 'helpers/device';
import { workerTypes } from 'constants/types';
import actions from 'actions';
import selectors from 'selectors';

import './MenuOverlay.scss';

const MenuOverlay = () => {
  const [
    buttons,
    documentPath,
    documentFilename,
    isDownloadable,
    isEmbedPrintSupported,
    isFullScreen,
    isDisabled,
    isOpen,
  ] = useSelector(
    state => [
      state.viewer.menuOverlay,
      selectors.getDocumentPath(state),
      state.document.filename,
      selectors.getDocumentType(state) !== workerTypes.XOD,
      selectors.isEmbedPrintSupported(state),
      selectors.isFullScreen(state),
      selectors.isElementDisabled(state, 'menuOverlay'),
      selectors.isElementOpen(state, 'menuOverlay'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const overlayRef = useRef();
  const [position, setPosition] = useState({ left: 0, right: 'auto' });

  const dataElementButtonMap = {
    filePickerButton: (
      <ActionButton
        dataElement="filePickerButton"
        label={t('action.openFile')}
        onClick={openFilePicker}
      />
    ),
    fullScreenButton: !isIOS && (
      <ActionButton
        dataElement="fullScreenButton"
        label={
          isFullScreen
            ? t('action.exitFullscreen')
            : t('action.enterFullscreen')
        }
        onClick={toggleFullscreen}
      />
    ),
    downloadButton: isDownloadable && (
      <ActionButton
        dataElement="downloadButton"
        label={t('action.download')}
        onClick={() =>
          downloadPdf(dispatch, {
            documentPath,
            filename: documentFilename,
          })
        }
      />
    ),
    printButton: (
      <ActionButton
        dataElement="printButton"
        label={t('action.print')}
        onClick={() => print(dispatch, isEmbedPrintSupported)}
        hidden={['mobile']}
      />
    ),
  };

  useEffect(() => {
    dispatch(
      actions.closeElements([
        'groupOverlay',
        'viewControlsOverlay',
        'searchOverlay',
        'toolStylePopup',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
      ]),
    );

    setPosition(getOverlayPositionBasedOn('menuButton', overlayRef));
  }, [dispatch, isOpen]);

  MenuOverlay.handleClickOutside = e => {
    const clickedMenuButton =
      e.target.getAttribute('data-element') === 'menuButton';

    if (!clickedMenuButton) {
      dispatch(actions.closeElements(['menuOverlay']));
    }
  };

  return isDisabled ? null : (
    <div
      className={classNames({
        Overlay: true,
        MenuOverlay: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element="menuOverlay"
      style={{ ...position }}
      ref={overlayRef}
    >
      {buttons.map(dataElement => {
        if (dataElementButtonMap[dataElement] !== undefined) {
          return (
            <React.Fragment key={dataElement}>
              {dataElementButtonMap[dataElement]}
            </React.Fragment>
          );
        }

        return <ToolButton key={dataElement} {...dataElement} />;
      })}
    </div>
  );
};

const clickOutsideConfig = {
  handleClickOutside: () => MenuOverlay.handleClickOutside,
};

export default onClickOutside(MenuOverlay, clickOutsideConfig);
