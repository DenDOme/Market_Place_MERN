import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, changeRole } from "../../stores/slices/authSlice";

const UpdateRoles = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUpdateRole = (userId, role) => {
    dispatch(changeRole({ userId, role }));
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Update User Roles</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <span>
                {user.username} - {user.role}
              </span>
              <select
                value={user.role}
                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </li>
          ))}
        </ul>
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
};

export default UpdateRoles;
