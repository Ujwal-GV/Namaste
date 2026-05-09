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
    <div className="w-full min-h-screen bg-black text-white p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-gray-900 border border-green-500/20 rounded-xl p-4 shadow flex flex-col lg:flex-row gap-4 items-center justify-between">

        {/* SEARCH */}
        <input
          type="text"
          placeholder={t("search")}
          className="w-full lg:w-1/3 px-4 py-2 rounded-full bg-black border border-gray-700 focus:outline-none focus:border-green-400 text-white placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-center lg:justify-end">

          <select
            className="px-3 py-2 rounded-lg bg-black border border-gray-700 text-white focus:border-green-400"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className="px-3 py-2 rounded-lg bg-black border border-gray-700 text-white focus:border-green-400"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            className="px-3 py-2 rounded-lg bg-black border border-gray-700 text-white focus:border-green-400"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="asc">Email A-Z</option>
            <option value="desc">Email Z-A</option>
          </select>
        </div>
      </div>

      {/* RESULTS */}
      {filteredUsers?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <DetailsCard key={user._id} details={user} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[40vh]">
          <p className="text-gray-400 text-lg">
            No users found
          </p>
        </div>
      )}
    </div>
  );
}