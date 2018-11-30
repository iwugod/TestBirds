import React from 'react';
import {TiStar} from 'react-icons/ti';

const ListItem = (props) =>{

  return (
 
    props.list.map(function(props){
            
            return <div className="list-select" key={props.id}>
            <img src={require(`../src/assets/${props.picture}`)} className="icon-member"/>
             <span className="del-wrap">
             <img src={require(`../src/assets/avatar-delete2.png`)}  className="del-item"/>
             </span>
            <div className="item-user">
                <div className="item-name">{props.username}<span className="icon-star"><TiStar/></span></div>
                <div className="item-role">{props.role}</div>
            </div>
        </div>
    })
    
  );
}


export default ListItem;
