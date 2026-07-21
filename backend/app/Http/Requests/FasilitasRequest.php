<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FasilitasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_fasilitas' => [
                'required',
                'string',
                'max:100',
                Rule::unique('fasilitas', 'nama_fasilitas')->ignore($this->route('fasilitas')),
            ],
        ];
    }
}
