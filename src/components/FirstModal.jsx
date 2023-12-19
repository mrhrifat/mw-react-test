import React from 'react'
import { Form, Modal } from 'react-bootstrap'

const FirstModal = ({ modalState, data, config, setConfig, dispatch, handleModalShowOne, handleModalCloseOne }) => {

    return (
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
                    onChange={() => setConfig({ ...config, checkbox: !config.checkbox })}
                />
            </Modal.Footer>
        </Modal>
    )
}

export default FirstModal