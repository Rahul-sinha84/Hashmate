import React, { useEffect, useState } from "react";
import utils from "../../components/utils";
import { connect } from "react-redux";
import { changeShowLoader } from "../../redux/action";

const PasswordCard = ({ val, ceramic, state, changeShowLoader }) => {
  const { loadSession, decryptData } = utils;
  const [domain, setDomain] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    getData();
  }, [val.id]);

  const getData = async () => {
    if (!val.id) return;
    try {
      changeShowLoader(true);
      // console.log(val.id, ceramic);
      const response = await loadSession(val.id, ceramic);
      const data = response.content;
      // console.log(data.cid);
      const jsonFile = await decryptData(data.cid, data.encSecret);

      setDomain(jsonFile.domain);
      setUsername(jsonFile.username);
      setPassword(jsonFile.password);
      setUrl(jsonFile.url);
      console.log(jsonFile);
      // .then(async (res) => {
      //   const data = res.content;
      //   console.log(data.cid);
      //   const jsonFile = await decryptData(data.cid, data.encSecret);
      // });
    } catch (err) {
      console.log(err);
    }
    changeShowLoader(false);
  };

  return (
    <div className="card">
      <div className="card__container">
        <div className="card__container--item">
          <div className="card__container--item__key">Domain:</div>
          <div className="card__container--item__value">{domain}</div>
        </div>
        <div className="card__container--item">
          <div className="card__container--item__key">Name:</div>
          <div className="card__container--item__value">{username}</div>
        </div>
        <div className="card__container--item">
          <div className="card__container--item__key">Password:</div>
          <div className="card__container--item__value">{password}</div>
        </div>
        <div className="card__container--item">
          <div className="card__container--item__key">URL:</div>
          <div className="card__container--item__value">{url}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps, { changeShowLoader })(PasswordCard);
