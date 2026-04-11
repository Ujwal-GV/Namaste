import React, { useMemo, useState } from "react";
import { useGetUsersList } from "../../hooks/useAdmin";
import DetailsCard from "../../components/DetailsCard";

export default function DetailsList() {
  const { data } = useGetUsersList();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("");

  const filteredUsers = useMemo(() => {
    let users = data || [];

    if (search) {
      users = users.filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter) {
      users = users.filter((u) => u.role === roleFilter);
    }

    if (statusFilter) {
      users = users.filter((u) => u.accountStatus === statusFilter);
    }

    if (sort === "asc") {
      users = [...users].sort((a, b) =>
        a.email.localeCompare(b.email)
      );
    } else if (sort === "desc") {
      users = [...users].sort((a, b) =>
        b.email.localeCompare(a.email)
      );
    }

    return users;
  }, [data, search, roleFilter, statusFilter, sort]);

  return (
    <div className="w-full min-h-screen p-4 custom-background-color space-y-4">

      <div className="bg-gray-800 p-4 rounded-xl shadow flex flex-col md:flex-row gap-3 items-center justify-between">

        <input
          type="text"
          placeholder="Search by email..."
          className="border p-2 rounded-full bg-gray-100 w-full md:w-1/3 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">

          <select
            className="border p-2 rounded-xl bg-gray-100 hover:cursor-pointer text-black"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className="border p-2  rounded-xl bg-gray-100 hover:cursor-pointer text-black"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            className="border p-2  rounded-xl bg-gray-100 hover:cursor-pointer text-black"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="asc">Email A-Z</option>
            <option value="desc">Email Z-A</option>
          </select>
        </div>
      </div>

      {filteredUsers?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <DetailsCard key={user._id} details={user} />
          ))}
        </div>
      ) : (
        <p className="text-center text-black">
          No users found
        </p>
      )}
    </div>
  );
}