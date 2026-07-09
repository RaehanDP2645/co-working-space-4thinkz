<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'nama_ruangan' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:100'],
            'jenis_ruangan' => [$isUpdate ? 'sometimes' : 'required', 'string', 'in:Meeting Room, Private Office, Hot Desk, Event Space'],
            'kapasitas' => [$isUpdate ? 'sometimes' : 'required', 'integer', 'min:1'],
            'harga' => [$isUpdate ? 'sometimes' : 'required', 'numeric', 'min:0'],
            'tingkat_privasi' => ['nullable', 'in:rendah, sedang, tinggi'],
            'mendukung_presentasi' => ['nullable', 'boolean'],
            'status' => ['nullable', 'in:tersedia, perbaikan, nonaktif'],
        ];
    }
}
