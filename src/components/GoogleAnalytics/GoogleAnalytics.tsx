// jscs:disable disallowSpacesInsideTemplateStringPlaceholders
import * as React from 'react';
const { Component } = React;
import { googleAnalyticsId } from '../../config';

const trackingCode = {
  __html: (// :off
    `(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=`
    + `function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;`
    + `e=o.createElement(i);r=o.getElementsByTagName(i)[0];`
    + `e.src='https://www.google-analytics.com/analytics.js';`
    + `r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));`
    + `ga('create','${googleAnalyticsId}','auto');`
  ), // :on
};

export class GoogleAnalytics extends Component {
  render() {
    return <script dangerouslySetInnerHTML={trackingCode}/>;
  }
}
