import React from 'react';

export default class PauseSVG extends React.Component {
	render() {
		return (
			<svg className={this.props.className} fill="currentColor" viewBox="0 0 24 24">
				<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
			</svg>
		);
	}
}