import React from 'react';

export default class PlaySVG extends React.Component {
	render() {
		return (
			<svg className={this.props.className} fill="currentColor" viewBox="0 0 24 24">
				<path d="M8 5v14l11-7z"/>
			</svg>
		);
	}
}