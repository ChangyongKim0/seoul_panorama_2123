import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { API_URI } from "../shortcut";
import { isMobile } from "../util/alias";

const default_expire_date = 365;

export const setCookie = (name, value, exp) => {
  let date = new Date();
  date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie =
    name +
    "=" +
    encodeURI(value) +
    ";expires=" +
    date.toUTCString() +
    ";path=/";
};

export const getCookie = (name) => {
  let value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return value
    ? value[2] === "true"
      ? true
      : value[2] === "false"
      ? false
      : decodeURI(value[2])
    : undefined;
};

export const deleteCookie = (name) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1999 00:00:10 GMT;";
};

const createCookie = (exp = default_expire_date) => {
  let date = new Date();
  let exp_date = new Date();
  const time = date.getTime();
  date.setTime(time);
  exp_date.setTime(time + exp * 24 * 60 * 60 * 1000);
  const id = date.toUTCString();
  document.cookie =
    "id=" + id + " " + time + ";expires=" + exp_date.toUTCString() + ";path=/";
  return id;
};

const _getIPAndLocation = (data) => {
  let date = new Date();
  date.setTime(date.getTime());
  return {
    date: date.toUTCString(),
    ip: data.ip,
    ip_version: data.version,
    city: data.city,
    region: data.region,
    country: data.country,
    country_name: data.country_name,
    continent_code: data.continent_code,
    longitude: data.longitude,
    latitude: data.latitude,
    asn: data.asn,
    org: data.org,
  };
};

const cookie_list = [
  "GRID_FACTOR",
  "ISO_FACTOR",
  "region_guid",
  "x_grid",
  "y_grid",
  "x_direction_to_add",
  "y_direction_to_add",
  "user_name",
  "region_no",
  "turing_test_completed",
  "use_eng",
  "visited_design_page",
  "modeling_uploaded_at_least_once",
  "found_easter_egg",
  "upload_no",
  "once_clicked_big_building",
];

export const GlobalVarContext = createContext({
  global_var: {},
  setGlobalVar: () => {},
});

const useGlobalVar = () => {
  const { global_var, setGlobalVar } = useContext(GlobalVarContext);
  return [global_var, setGlobalVar];
};

const reduceGlobalVar = (state, action) => {
  Object.keys(action).map((key) => {
    if (cookie_list.includes(key)) {
      setCookie(key, action[key], 365);
    }
  });
  console.log(action);
  console.log({ ...state, ...action });
  return { ...state, ...action };
};

// state : loading / fail / success
export const GlobalVarProvider = ({ children }) => {
  const [global_var, setGlobalVar] = useReducer(reduceGlobalVar, {
    now_visited: true,
    refreshed: true,
    media_mobile: true,
    snackbar: false,
    touchable: false,
  });

  useEffect(() => {
    let id = getCookie("id");
    let cookie_data = {};
    if (id === undefined) {
      id = createCookie(365);
      console.log("created cookie.");
      cookie_data = { id };
      setGlobalVar({ refreshed: false, id });
    } else {
      console.log("cookie already set: ID=" + id);
      cookie_data = { id };
      cookie_list.map((e) => {
        const each_cookie = getCookie(e);
        if (each_cookie !== undefined) {
          cookie_data[e] = each_cookie;
        }
      });
      // console.log(cookie_data);
      setGlobalVar({ refreshed: false, ...cookie_data });
    }
    setGlobalVar({
      touchable: isMobile(),
      media_mobile: window.matchMedia("screen and (max-width: 600px)").matches,
    });
    window.addEventListener("resize", () => {
      setGlobalVar({
        media_mobile: window.matchMedia("screen and (max-width: 600px)")
          .matches,
      });
    });
  }, []);

  const value = useMemo(() => {
    return { global_var, setGlobalVar };
  }, [global_var, setGlobalVar]);

  return (
    <GlobalVarContext.Provider value={value}>
      {children}
    </GlobalVarContext.Provider>
  );
};

export default useGlobalVar;
