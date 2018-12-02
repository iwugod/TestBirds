import React from 'react';
import {TiStar} from 'react-icons/ti';

const ListItem = (props) =>{

  const {index, id, username, role, picture, deleteMember } = props;

  return (
       <div className="list-select" key={id}>
            <img src={require(`../src/assets/${picture}`)} className="icon-member"/>
            <span className="del-wrap">
            <img src={require(`../src/assets/avatar-delete2.png`)} className="del-item" onClick={() => deleteMember(index)} />
            </span>
            <div className="item-user">
                <div className="item-name">{username}<span className="icon-star"><TiStar/></span></div>
                <div className="item-role">{role}</div>
            </div>
        </div>
    
  );
}

export default ListItem;
