export interface DischargeBody {
    patientName: string;
    doctorSigned: boolean;
    pharmacyChecked: boolean;
    followupScheduled: boolean;
    insuranceApproved: boolean;
}

export interface DischargeLogEntry {
    step: string;
    time: string;
}
