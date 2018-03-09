import React from 'react';

import Navigation from './Navigation';
import BackgroundImage from '../Poker/BackgroundImage'

export default class Layout extends React.Component{
  render(){
    return(
      <section className="page">

          <Navigation/>
        <section>
          {this.props.children}
        </section>

      </section>
    );
  }
}
