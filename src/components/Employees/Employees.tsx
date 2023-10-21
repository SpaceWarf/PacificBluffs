import "./Employees.scss";
import { useEffect, useState } from "react";
import { getProfiles, onProfilesSnapshot } from "../../utils/firestore";
import { ProfileInfo } from "../../redux/reducers/profile";
import ProfileCard from "../Common/ProfileCard";
import Loading from "../Common/Loading";
import Header from "../Common/Header";
import { getAlphabeticallyOrdered } from "../../utils/array";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Division } from "../../redux/reducers/divisions";

function Employees() {
  const { isAdmin } = useAuth();
  const { divisions } = useSelector((state: RootState) => state.divisions);
  const [employees, setEmployees] = useState([] as ProfileInfo[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const profiles = await getProfiles();
      setEmployees(profiles);
      onProfilesSnapshot((profiles: ProfileInfo[]) => setEmployees(profiles));
      setLoading(false);
    }
    fetchProfiles();
  }, []);

  function getEmployeesForDivision(division: Division): ProfileInfo[] {
    return getAlphabeticallyOrdered(employees.filter(employee => employee.division === division.id), 'name');
  }

  return (
    <div className="Employees">
      {loading ? (
        <Loading />
      ) : (
        <div className="content">
          {[...divisions].sort((a, b) => a.hierarchy - b.hierarchy).map(division => (
            <div className="Division">
              <Header text={division.name} decorated />
              <div className="content">
                {getEmployeesForDivision(division).map((employee: ProfileInfo) => (
                  <ProfileCard
                    key={employee.id}
                    profile={employee}
                    editable={isAdmin}
                    nameAsTitle
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Employees;