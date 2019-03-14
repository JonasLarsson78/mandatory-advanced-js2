import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import { Redirect } from 'react-router-dom';
import axios from 'axios';




class EditMovies extends Component{
  constructor(props){
    super(props);
    this.state = {data: null, redirect: false, error: "", validate: "", rating: 0};
  }
  valTitle = (title) =>{
    if (title.length > 39){
      this.setState({validate: "Not over 40 character."});
    }
    else{
      this.setState({validate: ""});
    }
  }

  valDirector = (dir) =>{
    if (dir.length > 39){
      this.setState({validate: "Not over 40 character."});
    }
    else{
      this.setState({validate: ""});
    }
  }
  valDescript = (de) =>{
    if (de.length > 299){
      this.setState({validate: "Not over 300 character."});
    }
    else{
      this.setState({validate: ""});
    }
  }

  onChangeTitel = (e) => {
    this.valTitle(e.target.value)
   this.setState({data: {
       ...this.state.data,
       title: e.target.value,
   } });   
  }
  onChangeDescription = (e) => {
    this.valDescript(e.target.value)
    this.setState({data: {
        ...this.state.data,
        description: e.target.value,
        
    } }); 
   }
   onChangeDirector = (e) => {
    this.valDirector(e.target.value)
    this.setState({data: {
        ...this.state.data,
        director: e.target.value,
        
    } }); 
   }
   onChangeRating = (e) => {
    this.setState({data: {
        ...this.state.data,
        rating: e.target.value,
        
    } }); 
   }
   onClick = () => {
    axios.put("http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/" + this.state.data.id, this.state.data) 
    .then(response => {
      this.setState({redirect: true})
    })
    .catch(error =>{
      if (error.response && error.response.status === 400) {
      this.setState({error: "Must fill all fields.."})
      }
    });
   }

  componentDidMount() {
    let id = this.props.match.params.id;

    axios.get("http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/" + id)
      .then(response => {
        this.setState({data: response.data });
      })
      .catch(error =>{
        if (error.response && error.response.status === 404) {
          this.setState({error: "Wrong Connection!!"})
        } 
      });
  }

  render(){
    
    
      if(this.state.error === "Wrong Connection!!"){
        return <p className="errorMess">Wrong Connection!!</p>
      }
      if (this.state.data === null){
          return <p>Loading...</p>
      }
      if (this.state.redirect === true){
        return <Redirect to="/"/>
      }
      let data = this.state.data
      let rating = parseFloat(data.rating).toFixed(1);
      return(
          <>
          <Helmet>
            <title>Edit Movie</title>
          </Helmet>
          
          <div className="mainForm">
          <label className="inputLabel">Titel</label><br/>
          <input maxLength="40" className="inputText" type="text" value={data.title} onChange={this.onChangeTitel}/><br/><br/>
          <label className="inputLabel">Description</label><br/>
          <textarea maxLength="300" className="inputTextA" value={data.description} onChange={this.onChangeDescription}/><br/>
          <label className="inputLabel">Director</label><br/>
          <input maxLength="40" className="inputText" type="text" value={data.director} onChange={this.onChangeDirector}/><br/><br/>
          <label className="inputLabel">Rating</label><br/>
          <input className="rating" type="range" min="0" max="5" step="0.1" value={rating} onChange={this.onChangeRating}/><br/>
          <span className="ratingNum"><Rater total={5} interactive={false} rating={Number(rating)}/> ({rating})</span><br/><br/>
          <button className="btn" onClick={this.onClick}>Update</button>
          <div className="errorMess">{this.state.error}</div>
          <div className="errorMess">{this.state.validate}</div>
          </div>
          </>
      );
  }
}

export default EditMovies;