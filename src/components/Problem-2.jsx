import React, { useEffect, useReducer, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

const initialState = {
    showModal1: false, showModal2: false
}

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
    const [searchParams, setSearchParams] = useState();
    const [data, setData] = useState()
    const [config, setConfig] = useState({ checkbox: false, prev: null, next: null })

    const handleModalShowOne = (e) => {
        const { textContent } = e.target
        setSearchParams(textContent)
        dispatch({ type: 'showModalOne', value: true })

    }

    const handleModalCloseOne = () => {
        dispatch({ type: 'showModalOne', value: false })
    }


    console.log(searchParams)


    useEffect(() => {
        if (searchParams !== undefined) {

            fetch(`https://contact.mediusware.com/api/${searchParams === 'All Contacts' ? 'contacts' : 'country-contacts/United%20States'}/`)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    setData(data?.results)
                }).catch(err => console.log(err))
        }

    }, [searchParams])

    console.log(data)

    return (

        <div className="container">
            <div className="row justify-content-center mt-5">
                <h4 className='text-center text-uppercase mb-5'>Problem-2</h4>

                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-lg btn-outline-primary" type="button" onClick={(e) => handleModalShowOne(e)}>All Contacts</button>
                    <button className="btn btn-lg btn-outline-warning" type="button" onClick={(e) => handleModalShowOne(e)}>US Contacts</button>
                </div>


                <Modal show={modalState.showModal1} size="lg" centered scrollable>
                    <Modal.Header>
                        <button className={`btn btn-lg modalBtnA`} type="button" onClick={(e) => handleModalShowOne(e)}>All Contacts</button>
                        <button className={`btn btn-lg modalBtnB`} type="button" onClick={(e) => handleModalShowOne(e)} >US Contacts</button>
                        <button className={`btn btn-lg modalBtnC`} type="button" onClick={() => handleModalCloseOne()}>Close</button>
                    </Modal.Header>
                    <Modal.Body>
                        <table className="table table-striped ">
                            <thead>
                                <tr>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Country</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data === undefined ?
                                    <tr key='0'>
                                        <td>Loading...</td>
                                        <td>Loading...</td>
                                    </tr> :
                                    data?.filter(item => config.checkbox === true ? item.id % 2 === 0 : item).map(item => (
                                        <tr key={item.id} onClick={() => dispatch({ type: 'showModalTwo', value: true })}>
                                            <td>{item?.phone}</td>
                                            <td>{item?.country?.name}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </Modal.Body>
                    <Modal.Footer className='d-flex justify-content-start'>
                        <Form.Check
                            type='checkbox'
                            id='0'
                            label='Show Even'
                            value={config.checkbox}
                            onChange={() => setConfig({ ...config, checkbox: true })}
                        />
                    </Modal.Footer>
                </Modal>

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