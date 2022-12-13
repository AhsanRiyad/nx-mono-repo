import { Role } from "../../common/enums/role.enum.js"

export interface JwtPayload {
    id: string
    username: string
    email: string,
    type: string,
    roles: Role[]
}