import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import axios from 'axios';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'



class Info extends Component{
    constructor(props){
        super(props);
        this.state = {data: {}, errorMess: ""}
    }

componentDidMount() {
    let id = this.props.match.params.id;

    axios.get("http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/" + id)
        .then(response => {
        this.setState({data: response.data });
        })
        .catch(error =>{
          if (error.response && error.response.status === 404) {
            this.setState({errorMess: "Wrong"});  
          } 
        });
}

 render(){
  let data = this.state.data;   
    
     return (
        <> 
        <Helmet>
        <title>{data.title}</title>
        </Helmet>
       
        <table className="infoTabel">
            <thead>
                <tr>
                    <th colSpan="2"><h2>Title: {data.title}</h2></th>
                </tr>
            </thead>    
            <tbody>
                <tr>
                    <td className="decTd" colSpan="2">{data.description}</td>
                </tr>
                <tr>
                    <td><b>Director:</b> {data.director}</td>
                    <td className="rateTd"><b>Rating: </b><Rater total={5} interactive={false} rating={data.rating}/> ({data.rating})</td>
                </tr>
            </tbody>
        </table>
        


         </>
     )};

}

export default Info;