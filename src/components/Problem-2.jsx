import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import FirstModal from './FirstModal';

const initialState = {
    showModal1: false, showModal2: false
}

export const stringReplaceSpaceWithDash = (str) => str.replace(' ', '-').toLowerCase()

const reducer = (state, action) => {
    switch (action.type) {
        case 'showModalOne':
            return { ...state, showModal1: action.value }
        case 'showModalTwo':
            return { ...state, showModal2: action.value }
        default:
            return state
    }
}

const Problem2 = () => {

    const [modalState, dispatch] = useReducer(reducer, initialState)
    const [dataToFetch, setDataToFetch] = useState();
    const [config, setConfig] = useState({ checkbox: false, prev: null, next: null })
    const [data, setData] = useState()
    const location = useLocation();
    const navigate = useNavigate()



    const handleModalShowOne = (e) => {
        const { textContent } = e.target
        setDataToFetch(stringReplaceSpaceWithDash(textContent))

        if (location.pathname === '/') {
            navigate(location.pathname + '/' + stringReplaceSpaceWithDash(textContent))
        } else {
            navigate(stringReplaceSpaceWithDash(textContent))
        }

        dispatch({ type: 'showModalOne', value: true })

    }

    const handleModalCloseOne = () => {
        navigate('/problem-2')
        dispatch({ type: 'showModalOne', value: false })
    }

    useEffect(() => {
        if (dataToFetch !== undefined) {

            fetch(`https://contact.mediusware.com/api/${dataToFetch === 'all-contacts' ? 'contacts' : 'country-contacts/United%20States'}/`)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    setData(data?.results)
                }).catch(err => console.log(err))
        }

    }, [dataToFetch])

    return (

        <div className="container">
            <div className="row justify-content-center mt-5">
                <h4 className='text-center text-uppercase mb-5'>Problem-2</h4>

                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-lg btn-outline-primary" type="button" onClick={(e) => handleModalShowOne(e)}>All Contacts</button>
                    <button className="btn btn-lg btn-outline-warning" type="button" onClick={(e) => handleModalShowOne(e)}>US Contacts</button>
                </div>

                <FirstModal modalState={modalState} data={data} config={config} setConfig={setConfig} dispatch={dispatch} handleModalShowOne={handleModalShowOne} handleModalCloseOne={handleModalCloseOne} />


                <Modal show={modalState.showModal2} size="md" centered>
                    <Modal.Header>
                        <button className={`btn btn-lg modalBtnC`} type="button" onClick={() => dispatch({ type: 'showModalTwo', value: false })}>Close</button>
                    </Modal.Header>
                    <Modal.Body>I'm Details of Contact</Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default Problem2;