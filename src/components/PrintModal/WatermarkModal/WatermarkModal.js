import React from 'react';

import PropTypes from 'prop-types';
import ColorPalette from 'components/ColorPalette';
import './WatermarkModal.scss';

export default class WatermarkModal extends React.PureComponent {

  static propTypes = {
    isVisible: PropTypes.bool,
    modalClosed: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
    this.canvasContainerRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isVisible !== undefined) {
      this.setState({
        isVisible: this.props.isVisible,
      });
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage, don't forget to compare the props
    if (this.props.isVisible !== prevProps.isVisible) {
      this.setState({
        isVisible: this.props.isVisible,
      });

      if (this.props.isVisible) {
        window.docViewer.setWatermark({
          // Draw diagonal watermark in middle of the document
          diagonal: {
            fontSize: 25, // or even smaller size
            fontFamily: 'sans-serif',
            color: 'red',
            opacity: 50, // from 0 to 100
            text: 'Watermark'
          },
    
          // Draw header watermark
          header: {
            fontSize: 10,
            fontFamily: 'sans-serif',
            color: 'red',
            opacity: 70,
            left: 'left watermark',
            center: 'center watermark',
            right: ''
          }
        });

        // window.docViewer.refreshAll();
        // window.docViewer.updateView();

        // https://www.pdftron.com/documentation/web/guides/watermarks/#draw-watermark-without-documentviewer

        window.docViewer.getDocument().loadCanvasAsync({
          pageIndex: 0,
          drawComplete: (canvas) => {
            this.canvasContainerRef.current.appendChild(canvas);
          }
        });
      }
      else {
        window.docViewer.setWatermark({});
        // window.docViewer.refreshAll();
        // window.docViewer.updateView();
      }
    }
  }

  closeModal() {
    this.setState({
      isVisible: false,
    });
    this.props.modalClosed();
  }

  render() {
    const { isVisible } = this.props;
    if (!isVisible) {
      return null;
    }
    return (
      <>
        <div className={'Modal Watermark'} data-element="waterMarkModal" onClick={() => this.closeModal()}>
          <div onClick={e => e.stopPropagation()}>
            {/* TODO pass in t */}
            {/* https://reactjs.org/docs/forms.html */}
            <form>
              <label>
                Location
              </label>
              {/* TODO turn this to a constant and iterate */}
              <select>
                <option>Center</option>
                <option>Top Left</option>
                <option>Top Right</option>
                <option>Top Center</option>
                <option>Bottom Left</option>
                <option>Bottom Right</option>
                <option>Bottom Center</option>
              </select>
              <label>
                Text
              </label>
              <input type="text"/>

              {/* TODO figure this one out */}
              {/* <ColorPalette /> */}
              <label>Opacity</label>
              <input type="range" min="1" max="100"></input>

            </form>

            <div ref={this.canvasContainerRef}>

            </div>
          </div>
          <div onClick={e => e.stopPropagation()}>
            <button>Reset</button>
            <button>Ok</button>
          </div>
        </div>
      </>
    );
  }
}