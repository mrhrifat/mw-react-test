import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import FirstModal from './FirstModal';

// Initial state of modal
const initialState = {
    showModal1: false, showModal2: false
}

// Replace string space with dash  All Contacts =>
export const stringReplaceSpaceWithDash = (str) => str.replace(' ', '-').toLowerCase()

// Modal reducer
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
    const [config, setConfig] = useState({ checkbox: false, page: 1, loading: false })
    const [data, setData] = useState()
    const location = useLocation();
    const navigate = useNavigate()
    const modalBodyRef = useRef(null);


    // Handle modal show one either with All Contacts or US 
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

    // Handle modal close one either with All Contacts or US 
    const handleModalCloseOne = () => {
        navigate('/problem-2')
        dispatch({ type: 'showModalOne', value: false })
    }


    // Fetch data initial
    const fetchDataInit = () => {
        setConfig({ ...config, loading: true })
        if (dataToFetch !== undefined) {
            fetch(`${import.meta.env.VITE_BASE_URL}${dataToFetch === 'all-contacts' ? 'contacts' : 'country-contacts/United%20States'}/`)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    setData(data?.results)
                    if (data?.next !== null) setConfig({ ...config, page: config.page + 1 })

                })
                .catch(err => console.log(err))
        }
        setConfig({ ...config, loading: false })
    }


    // Fetch data more
    const fetchData = () => {
        setConfig({ ...config, loading: true })

        if (!config.loading) {
            fetch(`${import.meta.env.VITE_BASE_URL}${dataToFetch === 'all-contacts' ? 'contacts' : 'country-contacts/United%20States'}/?page=${config.page}`)
                .then((res) => res.json())
                .then((data) => {
                    setData((prevData) => [...prevData, ...data?.results]);
                    if (data?.next !== null) {
                        setConfig((prevConfig) => ({ ...prevConfig, page: prevConfig.page + 1 }));
                    }
                })
                .catch((err) => console.log(err))
                .finally(() => {
                    setConfig((prevConfig) => ({ ...prevConfig, loading: false }));
                });
        }
    }


    // Handle modal body scroll
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;

        if (scrollHeight - scrollTop === clientHeight && !config.loading) {
            // User has scrolled to the bottom
            console.log('Finished')
            fetchData(); // Fetch more data
        }
    };


    useEffect(() => {
        fetchDataInit()

        const modalBody = modalBodyRef?.current;
        modalBody?.addEventListener('scroll', handleScroll);
        return () => {
            modalBody?.removeEventListener('scroll', handleScroll);
        };
    }, [dataToFetch])

    return (

        <div className="container">
            <div className="row justify-content-center mt-5">
                <h4 className='text-center text-uppercase mb-5'>Problem-2</h4>

                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-lg btn-outline-primary" type="button" onClick={(e) => handleModalShowOne(e)}>All Contacts</button>
                    <button className="btn btn-lg btn-outline-warning" type="button" onClick={(e) => handleModalShowOne(e)}>US Contacts</button>
                </div>

                <FirstModal modalState={modalState} data={data} config={config} setConfig={setConfig} dispatch={dispatch} handleModalShowOne={handleModalShowOne} handleModalCloseOne={handleModalCloseOne} ref={modalBodyRef} />


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