var React = require('react'),
    DOM = React.DOM, div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li

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

  //   return (
  //     // <div className='well pcard' onClick={(e) => this.props.handleClick(e)} >
  //     // <div className='row'>
  //     //     <div className='col-xs-4'>
  //     //         <img src='https://media-cdn.tripadvisor.com/media/photo-s/05/49/6b/df/le-grill-restaurant-and.jpg'
  //     //         width={'100%'}
  //     //         height={'100%'} />
  //     //     </div>
  //     //     <div className='col-xs-8'>
  //     //     <h3>Restaurant name</h3>
  //     //     <hr />
  //     //     <h5> Promotion name </h5>
  //     //     <h6 className='text-muted'> Promotion description </h6>
  //     //     <h6 className='text-muted'> Active until blah </h6>
  //     //     </div>
  //     // </div>
  //     // </div>
  // //)
  //   //
     return div(null,

    //   button({onClick: this.handleClick, disabled: this.state.disabled}, 'Add Item'),
    //
       ul({children: this.state.items.map(function(item) {
         return li(null, item)
       })})

    )
  },
})
