"use client"

// Cliente HTTP universal para llamadas a API
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

async function apiCall<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(endpoint, options)

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

export const apiClient = {
  // Periodos
  async getPeriodos() {
    return apiCall("/api/periodos")
  },
  async getPeriodoById(id: number) {
    return apiCall(`/api/periodos/${id}`)
  },
  async createPeriodo(data: unknown) {
    return apiCall("/api/periodos", "POST", data)
  },
  async updatePeriodo(id: number, data: unknown) {
    return apiCall(`/api/periodos/${id}`, "PUT", data)
  },
  async deletePeriodo(id: number) {
    return apiCall(`/api/periodos/${id}`, "DELETE")
  },

  // Materias
  async getMaterias() {
    return apiCall("/api/materias")
  },
  async getMateriaById(id: number) {
    return apiCall(`/api/materias/${id}`)
  },
  async createMateria(data: unknown) {
    return apiCall("/api/materias", "POST", data)
  },
  async updateMateria(id: number, data: unknown) {
    return apiCall(`/api/materias/${id}`, "PUT", data)
  },
  async deleteMateria(id: number) {
    return apiCall(`/api/materias/${id}`, "DELETE")
  },

  // Docentes
  async getDocentes() {
    return apiCall("/api/docentes")
  },
  async getDocenteById(id: number) {
    return apiCall(`/api/docentes/${id}`)
  },
  async createDocente(data: unknown) {
    return apiCall("/api/docentes", "POST", data)
  },
  async updateDocente(id: number, data: unknown) {
    return apiCall(`/api/docentes/${id}`, "PUT", data)
  },
  async deleteDocente(id: number) {
    return apiCall(`/api/docentes/${id}`, "DELETE")
  },

  // Estudiantes
  async getEstudiantes() {
    return apiCall("/api/estudiantes")
  },
  async getEstudianteById(id: number) {
    return apiCall(`/api/estudiantes/${id}`)
  },
  async createEstudiante(data: unknown) {
    return apiCall("/api/estudiantes", "POST", data)
  },
  async updateEstudiante(id: number, data: unknown) {
    return apiCall(`/api/estudiantes/${id}`, "PUT", data)
  },
  async deleteEstudiante(id: number) {
    return apiCall(`/api/estudiantes/${id}`, "DELETE")
  },

  // Matriculas
  async getMatriculas() {
    return apiCall("/api/matriculas")
  },
  async getMatriculaById(id: number) {
    return apiCall(`/api/matriculas/${id}`)
  },
  async createMatricula(data: unknown) {
    return apiCall("/api/matriculas", "POST", data)
  },
  async updateMatricula(id: number, data: unknown) {
    return apiCall(`/api/matriculas/${id}`, "PUT", data)
  },
  async deleteMatricula(id: number) {
    return apiCall(`/api/matriculas/${id}`, "DELETE")
  },

  // Carreras
  async getCarreras() {
    return apiCall("/api/carreras")
  },
  async getCarreraById(id: number) {
    return apiCall(`/api/carreras/${id}`)
  },
  async createCarrera(data: unknown) {
    return apiCall("/api/carreras", "POST", data)
  },
  async updateCarrera(id: number, data: unknown) {
    return apiCall(`/api/carreras/${id}`, "PUT", data)
  },
  async deleteCarrera(id: number) {
    return apiCall(`/api/carreras/${id}`, "DELETE")
  },
}
