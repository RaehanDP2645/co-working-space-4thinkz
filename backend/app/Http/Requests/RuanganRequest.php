<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RuanganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'nama_ruangan' => [$required, 'string', 'max:100'],
            'jenis_ruangan' => [$required, 'string', 'in:Meeting Room,Private Office,Open Space,Event Space'],
            'kapasitas' => [$required, 'integer', 'min:1'],
            'harga_per_jam' => [$required, 'numeric', 'min:0'],
            'gambar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'gambar_url' => ['nullable', 'string', 'url', 'max:1000'],
            'deskripsi' => ['nullable', 'string'],
            'tingkat_privasi' => ['nullable', 'in:publik,semi_private,private'],
            'mendukung_presentasi' => ['nullable', 'boolean'],
            'mendukung_event' => ['nullable', 'boolean'],
            'fasilitas' => ['nullable', 'array'],
            'fasilitas.*' => ['integer', 'exists:fasilitas,id'],
        ];
    }
}
