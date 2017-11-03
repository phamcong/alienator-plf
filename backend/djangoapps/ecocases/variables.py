from django.core.files.storage import FileSystemStorage
from django.core.files import File
import os
from django.conf import settings

image_fs = FileSystemStorage(location='/media/ecocases/')
esm_files_fs = FileSystemStorage(location='/media/esms/')
ecocase_image_fs = FileSystemStorage(location=os.path.join(
    settings.BASE_DIR, 'media/ecocases'))

case_type_choices = (
    ('Project', 'Project'),
    ('Proven cas', 'Proven cas'),
)

esm_dict = {
    '1': 'ESM1: Innover par les parties prenantes',
    '2': 'ESM2: Innover par le biomimétisme',
    '3': 'ESM3: Innover par les modes de consommation',
    '4': 'ESM4: Innover par les Systèmes Produits Services (PSS)',
    '5': 'ESM5: Innover par le territoire',
    '6': 'ESM6: Innover par la circularité',
    '7': 'ESM7: Innover par les nouvelles technologies'
}

esm_link = [
    'ecocase/pdfs/esm1.pdf',
    'ecocase/pdfs/esm2.pdf',
    'ecocase/pdfs/esm3.pdf',
    'ecocase/pdfs/esm4.pdf',
    'ecocase/pdfs/esm5.pdf',
    'ecocase/pdfs/esm6.pdf',
    'ecocase/pdfs/esm7.pdf'
]

esm_vote_point = {
    ('1', '1'),
    ('2', '2'),
    ('3', '3'),
    ('4', '4'),
    ('5', '5'),
    ('6', '6'),
    ('7', '7'),
    ('8', '8'),
    ('9', '9'),
    ('10', '10'),
}

vote_point_options = range(16)


def save_ecocase_images(title, images, path):
    joined_title = '_'.join(title.split(' '))
    image_url_list = []

    for count, x in enumerate(images):
        image_extension = x.name.split('.')[-1]
        print('extension:', image_extension)
        new_image_name = joined_title + '_' + \
            str(count) + '.' + image_extension
        print('image_name:', new_image_name)
        uploaded_image = ecocase_image_fs.save(new_image_name, x)
        print("uploaded image:", uploaded_image)
        image_url_list.append(path + new_image_name)
    return image_url_list
