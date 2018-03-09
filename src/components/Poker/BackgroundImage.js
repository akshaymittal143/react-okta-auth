import React from 'react';
import Background from './cards/table.png';

var sectionStyle = {
    width: "100%",
    height: "400px",
    backgroundImage: `url(${Background})`
}

export class BackgroundImage extends React.Component {
    render(){
        return(
            <img style={sectionStyle}></img>
        );
    }
}