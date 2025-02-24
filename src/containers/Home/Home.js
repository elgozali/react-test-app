import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.scss';
import { withRouter } from 'react-router-dom';

const apiUrl = 'https://jsonplaceholder.typicode.com/users';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [userRole, setUserRole] = useState('Viewer');
    const [editing, setEditing] = useState(false);
    const [editID, setEditID] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState();

    const fetchUsers = () => {
        setIsLoading(true);
        axios.get(apiUrl)
            .then((response) => {
                setIsLoading(false);
                setUsers(response.data);
                setItemsPerPage(5);
            })
            .catch((error) => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = (key) => {
        if (key === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const handleEdit = id => {
        const user = users.find(item => item.id === id);
        setEditID(id);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditing(true);
    };

    const handleSave = () => {
        const newData = users.map(item => {
            if (item.id === editID) {
                return {
                    ...item,
                    name: editName,
                    email: editEmail,
                };
            }
            return item;
        });
        setUsers(newData);
        setEditing(false);
        setEditID(null);
        setEditName('');
        setEditEmail('');
    };

    const handleCancel = () => {
        setEditing(false);
        setEditID(null);
        setEditName('');
        setEditEmail('');
    };

    const filteredUsers = users.filter((user) => {
        return (
            String(user.id).includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const sortedUsers = filteredUsers.sort((a, b) => {
        const isReversed = sortOrder === 'asc' ? 1 : -1;
        return sortBy === 'id' ? isReversed * a[sortBy] - b[sortBy] : isReversed * a[sortBy].localeCompare(b[sortBy]);
    });


    // pagination
    const maxPage = Math.ceil(sortedUsers.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const getPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedUsers.slice(startIndex, endIndex);
    };

    return (
        /* TODO: move table to a separate component and pass data as props to it*/
        <div className='table-container'>
            <div className='table-filters'>
                <div className='search-container'>
                    <input
                        type='text'
                        placeholder='Search by name or email'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className='role-container'>
                    <select id='role-select' value={userRole} onChange={event => setUserRole(event.target.value)}>
                        <option value='' disabled>Select Role</option>
                        <option value='Viewer'>Viewer</option>
                        <option value='Editor'>Editor</option>
                    </select>
                </div>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    ID
                                    {sortBy === 'id' &&
                                        (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('name')}>
                                    Name
                                    {sortBy === 'name' &&
                                        (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('email')}>
                                    Email
                                    {sortBy === 'email' &&
                                        (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                                {userRole === 'Editor' &&
                                    <th>Action</th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {getPageData().map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{editing && editID === user.id ? <input type='text' value={editName} onChange={event => setEditName(event.target.value)} /> : user.name}</td>
                                    <td>{editing && editID === user.id ? <input type='text' value={editEmail} onChange={event => setEditEmail(event.target.value)} /> : user.email}</td>
                                    {userRole === 'Editor' &&
                                        <td>
                                            {!editing && (
                                                <button onClick={() => handleEdit(user.id)}>Edit</button>
                                            )}
                                            {editing && editID === user.id && (
                                                <div className='action-btns'>
                                                    <button onClick={handleSave}>Save</button>
                                                    <button onClick={handleCancel}>Cancel</button>
                                                </div>
                                            )}
                                        </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='pagination-btns'>
                        <button disabled={currentPage === 1} onClick={handlePrevPage}>
                            <i className='fa fa-arrow-left'></i>
                        </button>
                        <p>{currentPage}</p>
                        <button disabled={currentPage === maxPage || !filteredUsers.length} onClick={handleNextPage}>
                            <i className='fa fa-arrow-right'></i>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default withRouter(Home);