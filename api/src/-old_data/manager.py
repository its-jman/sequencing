import os
import uuid
import datetime as dt
from dateutil.tz import tzlocal
from marshmallow import ValidationError

from old_data import utils
import config
from old_data.dataset import Dataset
from old_models.record import RecordSchema
from old_models.dataset import UploadMetaSchema


class Manager:
    """
    Control programmatic access to datasets.
    """

    def __init__(self):
        """
        _uploads = {
            "my_uuid": Dataset("my_uuid")
        }
        """
        self._datasets = {}

        self.refresh()

    def refresh(self):
        """
        Updates the datasets dictionary
        :return:
        """
        # modified_diff
        for dataset_id, dataset in self._datasets.items():
            if os.path.exists(dataset.path):
                dataset.refresh()
            # else:  # TODO: Add this back?
            #     self._datasets.pop(dataset_id)

        new_file_names = utils.get_directory_list(config.UPLOAD_FOLDER, join=False)

        # Any files that have been deleted/created since last refresh. DOES NOT HANDLE UPDATES.
        deleted_diff = self._datasets.keys() - new_file_names
        created_diff = new_file_names - self._datasets.keys()
        # This is now dealt with by the `Upload` class.
        # modified_diff = filter(lambda f: os.path.getmtime(f) > self._uploads[f].refresh_time, new_file_names)

        if deleted_diff:
            for dataset_id in deleted_diff:
                self._datasets.pop(dataset_id)

        if created_diff:
            for dataset_id in created_diff:
                if dataset_id in self._datasets:
                    print(
                        "Upload %s already exists in uploads... Overwriting."
                        % dataset_id
                    )
                # path = os.path.join(config.UPLOAD_FOLDER, dataset_id)
                self._datasets[dataset_id] = Dataset(dataset_id)

    @property
    def datasets(self):
        self.refresh()
        return self._datasets

    def get_new_id(self):
        """
        Gets a new UUID and ensures it is not already in use.
        :return: uuid4().hex
        """
        self.refresh()
        while True:
            new_id = uuid.uuid4().hex
            if new_id not in self._datasets:
                return new_id

    def create_new_dataset(self, name, user_filename, records):
        """
        Recieves params from request.

        From there, save details into corresponding files.
        dataset_meta_records_meta IS NOT saved to file. Load that upon startup.

        :param name:
        :param user_filename:
        :param records:
        :return:
        """
        upload_meta_schema = UploadMetaSchema()
        record_list_schema = RecordSchema(many=True)
        try:
            record_list_json = record_list_schema.dumps(records)

            upload_meta = upload_meta_schema.load(
                {
                    "name": name,
                    "user_filename": user_filename,
                    "upload_time": dt.datetime.now(tzlocal()).isoformat(),
                }
            )
            upload_meta_json = upload_meta_schema.dumps(upload_meta)
        except ValidationError as e:
            print("Error creating new upload: %s" % e)
            return None
        else:
            dataset_id = self.get_new_id()
            path = os.path.join(config.UPLOAD_FOLDER, dataset_id)
            os.mkdir(path)

            with open(os.path.join(path, "meta.json"), "w") as fp:
                fp.write(upload_meta_json)

            with open(os.path.join(path, "records.json"), "w") as fp:
                fp.write(record_list_json)

            self._datasets[dataset_id] = Dataset(dataset_id)
            return self._datasets[dataset_id]

    def delete_dataset(self, dataset_id):
        """
        Removes dataset from memory and filesystem.
        :param dataset_id: reference of the dataset to be deleted
        """
        self.refresh()
        if dataset_id not in self._datasets:
            return

        self._datasets[dataset_id].delete()


M = Manager()
