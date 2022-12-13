import { AuthGuard, UserRole } from "../../common/guards/auth.guard.js";
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";

export function Auth(...roles: UserRole[]) {
    return applyDecorators(
        SetMetadata("roles", roles),
        UseGuards(AuthGuard),
    )
}