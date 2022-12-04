import React, { useState, useEffect } from "react";
import PasswordCard from "./comp/PasswordCard";
import CreateModal from "./comp/CreateModal";
import { getItems } from "../components/helpers";
import { changeShowLoader } from "../redux/action";
import { connect } from "react-redux";

const Dashboard = ({ ceramic, state }) => {
  const { isCeramicAuthenticated, load } = state;

  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);

  const renderCards = () => {
    return data.map((val, ind) => (
      <PasswordCard ceramic={ceramic} val={data[ind]} key={val.id} />
    ));
  };
  useEffect(() => {
    if (isCeramicAuthenticated) {
      (async () => {
        changeShowLoader(true);
        const arr = await getItems(ceramic);
        // console.log(arr, "<-- arr");
        setData(arr ? arr : []);
      })();
    }
    changeShowLoader(false);
  }, [isCeramicAuthenticated, load]);
  return (
    <>
      <div className="dashboard">
        <div className="dashboard__container">
          <div className="dashboard__container--header">
            <div className="dashboard__container--header__left">
              <div className="dashboard__container--header__left--title">
                Dashboard
              </div>
            </div>
            <div className="dashboard__container--header--right">
              <div className="dashboard__container--header--right__btn-container">
                <button
                  onClick={() => setShowModal(true)}
                  className="secondary"
                >
                  Add Password
                </button>
              </div>
            </div>
          </div>
          <hr style={{ marginTop: "1rem" }} />
          <div className="dashboard__container--body">
            {data.length ? (
              renderCards()
            ) : (
              <div
                style={{
                  fontSize: "1.2rem",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                No Passwords yet, get started by adding a password !!
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateModal
        setShowModal={setShowModal}
        ceramic={ceramic}
        toShow={showModal}
      />
    </>
  );
};

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps, { changeShowLoader })(Dashboard);
