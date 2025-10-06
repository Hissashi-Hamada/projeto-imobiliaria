import api from "./http";
export default function useApi(){
return {
    register: (d) => api.post("/api/register", d).then(r=>r.data),
    login:    (d) => api.post("/api/login", d).then(r=>r.data),
    logout:   ()  => api.post("/api/logout").then(r=>r.data),
    profile:  ()  => api.get("/api/profile").then(r=>r.data),
    updateProfile: (data) => api.put("/api/profile", data).then(r=>r.data),
};
}