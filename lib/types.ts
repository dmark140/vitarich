import { UUID } from 'crypto'; 

export type HatchClassification = {
  id: number;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  daterec: string | null;
  br_no: string | null;
  good_egg: number | null;
  trans_crack: number | null;
  hatc_crack: number | null;
  trans_condemn: number | null;
  hatc_condemn: number | null;
  thin_shell: number | null;
  pee_wee: number | null;
  small: number | null;
  jumbo: number | null;
  d_yolk: number | null;
  ttl_count: number | null;
  is_active: boolean | null;
};

export type EggStorageMngt = {
  id: number
  created_at: string
  created_by: string | null
  updated_at: string | null
  updated_by: string | null
  egg_storage_temp: string | null
  room_temp: string | null
  egg_sto_humi: string | null
  egg_stemp_start: string | null
  egg_stemp_end: string | null
  egg_shell_temp: string | null
  egg_shell_temp_date: string | null
  duration: number | null
  remarks: string | null
  is_active: boolean | null
}


