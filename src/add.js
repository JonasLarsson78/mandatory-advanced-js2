import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {Helmet} from "react-helmet";
import axios from 'axios';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'


class AddMovies extends Component{
  constructor(props){
    super(props);
    this.state = {data: {title: "",description: "", director: "", rating: 0},
    redirect: false,
    error: "",
    validate: "",
   };
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
    },error: "" });   
   }

   onChangeDescription = (e) => {
    this.valDescript(e.target.value)
    this.setState({data: {
        ...this.state.data,
        description: e.target.value,
        
    },error: "" }); 
   }
   onChangeDirector = (e) => {
    this.valDirector(e.target.value)
    this.setState({data: {
        ...this.state.data,
        director: e.target.value,
        
    },error: "" }); 
   }

   onChangeRating = (e) => {
    this.setState({data: {
        ...this.state.data,
        rating: e.target.value,
        
    },error: "" }); 
   }

   onClick = () => {
     let data = this.state.data
     
    axios.post("http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/", data)
    .then((res) => {
      this.setState({redirect: true})
    })
    .catch((err) => {
      this.setState({error: "Must fill all fields.."});
    })
  }
  

  render(){
    let rating = parseFloat(this.state.data.rating).toFixed(1);
    if (this.state.redirect === true){
      return <Redirect to="/"/>
    }
      return(
          <>
          <Helmet>
            <title>Add Movie</title>
          </Helmet>
          
          <div className="mainForm">
          <label className="inputLabel">Titel:</label><br/>
          <input placeholder="Type in movie titel." maxLength="40" className="inputText" type="text" onChange={this.onChangeTitel}/><br/><br/>
          <label className="inputLabel">Description:</label><br/>
          <textarea placeholder="Type in movie description." maxLength="300" className="inputTextA" onChange={this.onChangeDescription}/><br/>
          <label className="inputLabel">Director:</label><br/>
          <input placeholder="Type in director's name." maxLength="40" className="inputText" type="text" onChange={this.onChangeDirector}/><br/><br/>
          <label className="inputLabel">Rating:</label>
          <input className="rating" type="range" min="0" max="5" step="0.1" value={rating} onChange={this.onChangeRating}/><br/>
          <span className="ratingNum"><Rater total={5} interactive={false} rating={Number(rating)}/> ({rating})</span><br/><br/>
          <button className="btn" onClick={this.onClick}>Save</button><br/>
          <div className="errorMess">{this.state.error}</div>
          <div className="errorMess">{this.state.validate}</div>
          </div>



          </>
      );
  }
}

export default AddMovies;