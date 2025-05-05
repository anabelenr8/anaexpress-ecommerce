import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, updateUserRole } from '../../services/api';
import ActionButton from '../common/ActionButton';
import TableWrapper from '../common/TableWrapper';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';


const UserManager = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refreshData, dataVersion } = useApp();

  useEffect(() => {
    if (user) {
      console.log('👤 User is loaded:', user);
      fetchUsers();
    }
  }, [user, dataVersion]);
  

  const fetchUsers = () => {
    getUsers()
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error('Failed to fetch users:', err);
        alert('Failed to fetch users.');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id)
        .then(() => {
          alert('User deleted');
          refreshData();
        })
        .catch(() => alert('Failed to delete user.'));
    }
  };

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole)
      .then(() => {
        alert(`User promoted to ${newRole}`);
        refreshData(); 
      })
      .catch(() => alert('Failed to update role.'));
  };

  return (
    <TableWrapper
      title="Manage Users"
      headers={['Email', 'ID', 'Role', 'Actions']}
    >
      {users.map(user => (
        <tr key={user.id}>
          <td>{user.email || 'unknown@email.com'}</td>
          <td>{user.id}</td>
          <td>{user.role || 'user'}</td>
          <td className="text-end">
            {user.role !== 'admin' && (
              <ActionButton
                variant="outline-success"
                className="me-2"
                onClick={() => handleRoleChange(user.id, 'admin')}
              >
                Promote to Admin
              </ActionButton>
            )}
            <ActionButton variant="danger" onClick={() => handleDelete(user.id)}>
              Delete
            </ActionButton>
          </td>
        </tr>
      ))}
    </TableWrapper>
  );
};

export default UserManager;
