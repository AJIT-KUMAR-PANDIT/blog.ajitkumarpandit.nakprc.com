import React from 'react';

export default class StopSVG extends React.Component {
	render() {
		return (
			<svg className={this.props.className} fill="currentColor" viewBox="0 0 24 24">
				<path d="M6 4h12v16H6z"/>
			</svg>
		);
	}
}