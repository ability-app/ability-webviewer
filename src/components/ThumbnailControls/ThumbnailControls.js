import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Button from 'components/Button';
import core from 'core';

import './ThumbnailControls.scss';

class ThumbnailControls extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
  }

  rotateClockwise = () => {
    const { index } = this.props;
    core.rotatePages([index + 1], window.CoreControls.PageRotation.e_90);
  }

  rotateCounterClockwise = () => {
    const { index } = this.props;
    core.rotatePages([index + 1], window.CoreControls.PageRotation.e_270);
  }

  deletePage = () => {
    const { index } = this.props;
    core.removePages([index + 1]);
  }

  render() {
    return (
      <div className="thumbnailControls" data-element="thumbnailControls">
        <Button
          img="ic_rotate_left_black_24px"
          onClick={this.rotateCounterClockwise}
          title="action.rotateCounterClockwise"
        />
        <Button
          img="ic_delete_black_24px"
          onClick={this.deletePage}
          title="action.delete"
        />
        <Button
          img="ic_rotate_right_black_24px"
          onClick={this.rotateClockwise}
          title="action.rotateClockwise"
        />
      </div>
    );
  }
}

export default withTranslation()(ThumbnailControls);