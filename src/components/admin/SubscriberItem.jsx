import React, { useState } from "react";
import propTypes from "prop-types";
import MotiveModal from "./MotiveModal";
//import 'bootstrap/dist/css/bootstrap.min.css';

export default function SubscriberItem(subscriber) {
  const { _id, interests, skills } = subscriber.subscriber;
  const { fullName, email } = subscriber.subscriber.user;
  console.log(_id, interests, skills, fullName, email);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setSub(_id);
    setName(fullName);
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [sub, setSub] = useState();
  const [name, setName] = useState();

  console.log("SUBS " + sub);
  return (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title" style={{ display: "inline" }}>
          {fullName}
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">{email}</h6>
        {
          // <button type="button" className="btn btn-info">Editar informacion</button>
        }
        <button type="button" className="btn btn-danger" onClick={handleClick}>
          Eliminar usuario
        </button>
        <MotiveModal toggle={toggle} isOpen={isOpen} sub={sub} name={name} />
      </div>
    </div>
  );
}

SubscriberItem.propTypes = {
  subscriber: propTypes.object.isRequired,
  user: propTypes.object.isRequired,
  fullName: propTypes.string.isRequired,
  _id: propTypes.string.isRequired,
  interests: propTypes.string.isRequired,
  skills: propTypes.string.isRequired,
  email: propTypes.string.isRequired,
};
