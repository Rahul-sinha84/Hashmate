import React, { useState } from "react";
import { connect } from "react-redux";
import { storeOnIpfs } from "../../components/helpers";
import { changeShowLoader, changeLoad } from "../../redux/action";

const CreateModal = ({
  toShow,
  ceramic,
  state,
  changeShowLoader,
  setShowModal,
  changeLoad,
}) => {
  if (!toShow) return null;

  const { load } = state;

  const [domain, setDomain] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");

  const onSubmit = async () => {
    if (!ceramic)
      return alert("Ceramic is not connected, try reloading the page !!");
    if (!domain || !username || !password || !url)
      return alert("Please fill all the values !!");
    try {
      changeShowLoader(true);
      const obj = { username, domain, password, url };
      await storeOnIpfs(obj, ceramic);
      changeLoad(!load);
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
    changeShowLoader(false);
  };

  return (
    <div className="modal">
      <div className="modal__container">
        <div className="modal__container--head">
          Please fill the given fields:
        </div>
        <div className="modal__container--middle">
          <div className="modal__container--middle__input-container">
            <div className="input">
              <div className="input-label">Domain:</div>
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="input-text"
              />
            </div>
            <div className="input">
              <div className="input-label">Username:</div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-text"
              />
            </div>
            <div className="input">
              <div className="input-label">Password: </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-text"
              />
            </div>
            <div className="input">
              <div className="input-label">URL:</div>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-text"
              />
            </div>
          </div>
        </div>
        <div className="modal__container--foot">
          <button onClick={onSubmit} className="primary">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps, { changeShowLoader, changeLoad })(
  CreateModal
);
