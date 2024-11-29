import { Profile } from "../../model/profile.model";

export function hasProfileChanges(
    formValue: any,
    initialProfileData: Profile | null,
    hasFileChange: boolean
): boolean {
    if (!initialProfileData) return false

    const {firstName, lastName, email, phone} = formValue

    return (
        firstName !== initialProfileData.firstName ||
        lastName !== initialProfileData.lastName ||
        email !== initialProfileData.email ||
        phone !== initialProfileData.phone ||
        hasFileChange
    )
}

export function populateForm(profileForm: any, profile: Profile): void {
    profileForm.patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || '',
    })
}