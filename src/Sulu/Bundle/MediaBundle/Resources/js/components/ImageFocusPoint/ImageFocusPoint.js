// @flow
import React from 'react';
import type {Point} from './types';
import ImageFocusPointCell from './ImageFocusPointCell';
import imageFocusPointStyles from './imageFocusPoint.scss';

const FOCUS_POINT_MATRIX_SIZE = 3;

type Props = {
    image: string,
    value: Point,
    onChange: (value: Point) => void,
};

export default class ImageFocusPoint extends React.PureComponent<Props> {
    createFocusPoints(selectedPoint: Point) {
        const points = [];

        for (let row = 0; row < FOCUS_POINT_MATRIX_SIZE; row++) {
            for (let column = 0; column < FOCUS_POINT_MATRIX_SIZE; column++) {
                points.push(this.createFocusPoint(selectedPoint, column, row));
            }
        }

        return points;
    }

    createFocusPoint(selectedPoint: Point, column: number, row: number) {
        const key = `${column}-${row}`;
        const props = {
            size: 100 / FOCUS_POINT_MATRIX_SIZE,
            value: {x: column, y: row},
            onClick: this.handleFocusPointClick,
        };

        if (selectedPoint.x === column && selectedPoint.y === row) {
            return (<ImageFocusPointCell key={key} {...props} active={true} />);
        }

        if (this.isLeftOfSelectedPoint(selectedPoint, row, column)) {
            return (<ImageFocusPointCell key={key} {...props} arrowDirection="left" />);
        }

        if (this.isRightOfSelectedPoint(selectedPoint, row, column)) {
            return (<ImageFocusPointCell key={key} {...props} arrowDirection="right" />);
        }

        if (this.isAboveOfSelectedPoint(selectedPoint, row, column)) {
            return (<ImageFocusPointCell key={key} {...props} arrowDirection="top" />);
        }

        if (this.isBeneathOfSelectedPoint(selectedPoint, row, column)) {
            return (<ImageFocusPointCell key={key} {...props} arrowDirection="bottom" />);
        }

        if (this.isAboveRightOfSelectedPoint(selectedPoint, row, column)) {
            return (<ImageFocusPointCell key={key} {...props} arrowDirection="top-right" />);
        }

        if (this.isAboveLeftOfSelectedPoint(selectedPoint, row, column)) {
            return (<ImageFocusPointCell key={key} {...props} arrowDirection="top-left" />);
        }

        if (this.isBeneathRightOfSelectedPoint(selectedPoint, row, column)) {
            return (<ImageFocusPointCell key={key} {...props} arrowDirection="bottom-right" />);
        }

        if (this.isBeneathLeftOfSelectedPoint(selectedPoint, row, column)) {
            return (<ImageFocusPointCell key={key} {...props} arrowDirection="bottom-left" />);
        }

        return <ImageFocusPointCell key={key} {...props} />;
    }

    isLeftOfSelectedPoint(selectedPoint: Point, row: number, column: number) {
        return selectedPoint.x - 1 === column && selectedPoint.y === row;
    }

    isRightOfSelectedPoint(selectedPoint: Point, row: number, column: number) {
        return selectedPoint.x + 1 === column && selectedPoint.y === row;
    }

    isAboveOfSelectedPoint(selectedPoint: Point, row: number, column: number) {
        return selectedPoint.x === column && selectedPoint.y - 1 === row;
    }

    isAboveLeftOfSelectedPoint(selectedPoint: Point, row: number, column: number) {
        return selectedPoint.x - 1 === column && selectedPoint.y - 1 === row;
    }

    isAboveRightOfSelectedPoint(selectedPoint: Point, row: number, column: number) {
        return selectedPoint.x + 1 === column && selectedPoint.y - 1 === row;
    }

    isBeneathOfSelectedPoint(selectedPoint: Point, row: number, column: number) {
        return selectedPoint.x === column && selectedPoint.y + 1 === row;
    }

    isBeneathRightOfSelectedPoint(selectedPoint: Point, row: number, column: number) {
        return selectedPoint.x + 1 === column && selectedPoint.y + 1 === row;
    }

    isBeneathLeftOfSelectedPoint(selectedPoint: Point, row: number, column: number) {
        return selectedPoint.x - 1 === column && selectedPoint.y + 1 === row;
    }

    handleFocusPointClick = (selectedPoint: Point) => {
        this.props.onChange(selectedPoint);
    };

    render() {
        const {
            image,
            value,
        } = this.props;

        return (
            <div className={imageFocusPointStyles.imageFocusPoint}>
                <div className={imageFocusPointStyles.focusPoints}>
                    {this.createFocusPoints(value)}
                </div>
                <img className={imageFocusPointStyles.image} src={image} />
            </div>
        );
    }
}
