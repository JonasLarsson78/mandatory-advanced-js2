import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import axios from 'axios';
import Rater from 'react-rater'
import { Link } from 'react-router-dom';
import 'react-rater/lib/react-rater.css'
const Linkify = require('linkifyjs/react');

function convertUrl(str){
    let options = {/* … */};
    return <Linkify tagName="span" options={options}>{str}</Linkify>;
  }


class Info extends Component{
    constructor(props){
        super(props);
        this.state = {data: {}, errorMess: ""}
    }

componentDidMount() {
    let id = this.props.match.params.id;
    this.source = axios.CancelToken.source();

    axios.get("http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/" + id,
    {cancelToken: this.source.token})
        .then(response => {
        this.setState({data: response.data });
        })
        .catch(error =>{
        if (axios.isCancel(error)){
            return;
            }
          if (error.response && error.response.status === 404) {
            this.setState({errorMess: "Wrong Connection!! Try to reload page."});  
          } 
        });
}
    componentWillMount(){
        if (this.source){
        this.source.cancel();
        }
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
                    <th style={{borderRadius: '10px 10px 0 0'}} colSpan="2">
                        <h2 className="mainH2">{data.title}</h2>
                        <a rel="noopener noreferrer" title="Search for movie on IMDB" target="_blank" href={"https://www.imdb.com/search/title?title=" + data.title + "&view=simple"}>
                            <img alt="imdb" src={require("./iconfinder_imdb.png")}/>
                        </a>
                    </th>
                </tr>
            </thead>    
            <tbody>
                <tr>
                    <td className="decTd" colSpan="2"><b>Description:</b><br/>{convertUrl(data.description)}</td>
                </tr>
                <tr>
                    <td><b>Director:</b> {data.director}</td>
                    <td className="rateTd"><b>Rating: </b><Rater total={5} interactive={false} rating={Number(data.rating)}/> ({data.rating}) <Link to={"/edit/" + data.id}><button className="btn"><span>Edit</span></button></Link></td>
                </tr>
            </tbody>
            <tfoot>
         <tr>
           <td colSpan="2" style={{borderRadius: '0 0 10px 10px', backgroundColor: "#4CAF50"}}/>
         </tr>
       </tfoot>
        </table>
        <div className="errorMess">{this.state.errorMess}</div>
         </>
     )};
}

export default Info;