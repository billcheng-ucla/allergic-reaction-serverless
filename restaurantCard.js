var React = require('react'),
    DOM = React.DOM,
    div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li, hr = DOM.hr
    img = DOM.img
    h4 = DOM.h4
    p = DOM.p

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

  // We initialise its state by using the `props` that were passed in when it
  // was first rendered. We also want the button to be disabled until the
  // component has fully mounted on the DOM
  getInitialState: function() {
    return {items: this.props.items, disabled: true}
  },

  // Once the component has been mounted, we can enable the button
  componentDidMount: function() {
    this.setState({disabled: false})
  },

  // Then we just update the state whenever its clicked by adding a new item to
  // the list - but you could imagine this being updated with the results of
  // AJAX calls, etc
  handleClick: function() {
    this.setState({
      items: this.state.items.concat('Item ' + this.state.items.length)
    })
  },

  // For ease of illustration, we just use the React JS methods directly
  // (no JSX compilation needed)
  // Note that we allow the button to be disabled initially, and then enable it
  // when everything has loaded
  render: function() {
    return div(null,

      div({className: 'col-md-4'},
       img({src:'https://resizer.otstatic.com/v2/photos/small/'+this.props.rid +'.jpg'})
      ),

      div({className: 'col-md-8'},
        h4(null, this.props.name),
        hr(),
        p(null, 'here is some text')
      )

    );

  },
})
